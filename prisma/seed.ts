import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Definición de permisos ───────────────────────────────────────────────────

const ALL_PERMISSIONS = [
  { name: 'reservation:create',     description: 'Crear nuevas reservas' },
  { name: 'reservation:read',       description: 'Ver reservas' },
  { name: 'reservation:update:own', description: 'Modificar propia reserva' },
  { name: 'reservation:update',     description: 'Modificar cualquier reserva' },
  { name: 'reservation:cancel',     description: 'Cancelar reservas' },
  { name: 'waitlist:join',          description: 'Unirse a lista de espera' },
  { name: 'waitlist:read',          description: 'Ver lista de espera' },
  { name: 'calendar:read',          description: 'Ver calendario visual' },
  { name: 'pricing:update',         description: 'Actualizar precios dinámicos' },
  { name: 'stats:read',             description: 'Ver dashboard de estadísticas' },
  { name: 'user:manage',            description: 'Gestionar usuarios' },
  { name: 'role:manage',            description: 'Gestionar roles' },
  { name: 'permission:manage',      description: 'Gestionar permisos' },
  { name: 'rooms:manage',           description: 'Gestionar habitaciones e imágenes' },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  guest: [
    'reservation:create',
    'reservation:read',
    'reservation:update:own',
    'waitlist:join',
  ],
  receptionist: [
    'reservation:read',
    'reservation:update',
    'reservation:cancel',
    'waitlist:read',
    'calendar:read',
  ],
  admin: [
    'reservation:create',
    'reservation:read',
    'reservation:update',
    'reservation:cancel',
    'waitlist:join',
    'waitlist:read',
    'calendar:read',
    'pricing:update',
    'stats:read',
    'user:manage',
    'role:manage',
    'permission:manage',
    'rooms:manage',
  ],
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  // Roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'guest' },
      update: {},
      create: {
        name: 'guest',
        description: 'Puede buscar, reservar, modificar y unirse a waitlist (HU-01, HU-02, HU-06, HU-08)',
      },
    }),
    prisma.role.upsert({
      where: { name: 'receptionist' },
      update: {},
      create: {
        name: 'receptionist',
        description: 'Gestiona reservaciones y ve el calendario visual (HU-04, HU-05)',
      },
    }),
    prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Precios dinámicos y dashboard de estadísticas (HU-03, HU-07)',
      },
    }),
  ]);

  console.log('✔ Roles:', roles.map(r => r.name).join(', '));

  // Permisos
  await Promise.all(
    ALL_PERMISSIONS.map(p =>
      prisma.permission.upsert({
        where: { name: p.name },
        update: {},
        create: p,
      }),
    ),
  );

  console.log('✔ Permisos:', ALL_PERMISSIONS.length, 'creados');

  // Asignación rol → permisos
  const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));

  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap[roleName];

    const permissions = await prisma.permission.findMany({
      where: { name: { in: permNames } },
      select: { id: true },
    });

    await prisma.rolePermission.createMany({
      data: permissions.map(p => ({ roleId, permissionId: p.id })),
      skipDuplicates: true,
    });

    console.log(`✔ ${roleName}: ${permissions.length} permisos asignados`);
  }

  // Admin user
  const adminRole = roles.find(r => r.name === 'admin')!;
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ilu.com' },
    update: {},
    create: {
      email: 'admin@ilu.com',
      passwordHash: await bcrypt.hash('Admin1234!', 10),
      roleId: adminRole.id,
    },
  });

  console.log('✔ Usuario admin:', adminUser.email);

  // Amenities
  const amenityNames = [
    { name: 'WiFi',             icon: 'wifi' },
    { name: 'Televisión',       icon: 'tv' },
    { name: 'Aire acondicionado', icon: 'wind' },
    { name: 'Minibar',          icon: 'glass-water' },
    { name: 'Caja fuerte',      icon: 'lock' },
    { name: 'Jacuzzi',          icon: 'bath' },
    { name: 'Terraza privada',  icon: 'sun' },
    { name: 'Sala de estar',    icon: 'sofa' },
    { name: 'Escritorio',       icon: 'laptop' },
    { name: 'Desayuno incluido', icon: 'coffee' },
  ];

  const amenities = await Promise.all(
    amenityNames.map(a =>
      prisma.amenity.upsert({ where: { name: a.name }, update: {}, create: a }),
    ),
  );

  const amenityMap = Object.fromEntries(amenities.map(a => [a.name, a.id]));
  console.log('✔ Amenities:', amenities.length, 'creadas');

  // Tipos de habitación
  const roomTypes = await Promise.all([
    prisma.roomType.upsert({
      where: { name: 'standard' },
      update: {},
      create: { name: 'standard', basePricePerNight: 80.00, maxCapacity: 2, maxAdults: 2, maxChildren: 0, description: 'Habitación estándar con cama doble' },
    }),
    prisma.roomType.upsert({
      where: { name: 'suite' },
      update: {},
      create: { name: 'suite', basePricePerNight: 150.00, maxCapacity: 3, maxAdults: 2, maxChildren: 1, description: 'Suite con sala de estar y vista panorámica' },
    }),
    prisma.roomType.upsert({
      where: { name: 'premium' },
      update: {},
      create: { name: 'premium', basePricePerNight: 220.00, maxCapacity: 4, maxAdults: 2, maxChildren: 2, description: 'Habitación premium con jacuzzi y terraza privada' },
    }),
  ]);

  // Asignar amenities a tipos
  const typeAmenities: Record<string, string[]> = {
    standard: ['WiFi', 'Televisión', 'Aire acondicionado', 'Caja fuerte', 'Escritorio'],
    suite:    ['WiFi', 'Televisión', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Sala de estar', 'Desayuno incluido'],
    premium:  ['WiFi', 'Televisión', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Jacuzzi', 'Terraza privada', 'Sala de estar', 'Desayuno incluido'],
  };

  for (const roomType of roomTypes) {
    const amenityIds = typeAmenities[roomType.name].map(n => amenityMap[n]);
    await prisma.roomTypeAmenity.deleteMany({ where: { roomTypeId: roomType.id } });
    await prisma.roomTypeAmenity.createMany({
      data: amenityIds.map(amenityId => ({ roomTypeId: roomType.id, amenityId })),
      skipDuplicates: true,
    });
  }

  console.log('✔ Tipos de habitación:', roomTypes.map(t => t.name).join(', '));

  // Habitaciones
  const roomsData = [
    // Piso 1 — standard
    { roomNumber: '101', roomTypeId: roomTypes[0].id, floor: 1 },
    { roomNumber: '102', roomTypeId: roomTypes[0].id, floor: 1 },
    { roomNumber: '103', roomTypeId: roomTypes[0].id, floor: 1 },
    { roomNumber: '104', roomTypeId: roomTypes[0].id, floor: 1 },
    // Piso 2 — standard
    { roomNumber: '201', roomTypeId: roomTypes[0].id, floor: 2 },
    { roomNumber: '202', roomTypeId: roomTypes[0].id, floor: 2 },
    // Piso 2 — suite
    { roomNumber: '203', roomTypeId: roomTypes[1].id, floor: 2 },
    { roomNumber: '204', roomTypeId: roomTypes[1].id, floor: 2 },
    // Piso 3 — suite
    { roomNumber: '301', roomTypeId: roomTypes[1].id, floor: 3 },
    { roomNumber: '302', roomTypeId: roomTypes[1].id, floor: 3 },
    // Piso 3 — premium
    { roomNumber: '303', roomTypeId: roomTypes[2].id, floor: 3 },
    { roomNumber: '304', roomTypeId: roomTypes[2].id, floor: 3 },
  ];

  await Promise.all(
    roomsData.map(r =>
      prisma.room.upsert({
        where: { roomNumber: r.roomNumber },
        update: {},
        create: r,
      }),
    ),
  );

  console.log('✔ Habitaciones:', roomsData.length, 'creadas');

  // Reservación de prueba en la última habitación
  const lastRoom = await prisma.room.findFirst({ orderBy: { id: 'desc' } });

  if (lastRoom) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkOut = new Date(today);
    checkOut.setDate(checkOut.getDate() + 2);

    const guest = await prisma.guest.upsert({
      where: { email: 'huesped.prueba@ilu.com' },
      update: {},
      create: {
        firstName: 'Huésped',
        lastName: 'Prueba',
        email: 'huesped.prueba@ilu.com',
      },
    });

    await prisma.reservation.upsert({
      where: { confirmationCode: 'RES-SEED0001' },
      update: {},
      create: {
        confirmationCode: 'RES-SEED0001',
        guestId: guest.id,
        roomId: lastRoom.id,
        checkIn: today,
        checkOut,
        guestCount: 1,
        totalPrice: 0,
        status: 'CONFIRMED',
      },
    });

    console.log(`✔ Reservación de prueba: habitación ${lastRoom.roomNumber} (${today.toISOString().slice(0, 10)} → ${checkOut.toISOString().slice(0, 10)})`);
  }
}

main()
  .catch(err => {
    console.error('Error en seed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
