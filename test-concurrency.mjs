/**
 * Prueba de concurrencia: dos usuarios intentan reservar la misma habitación
 * en el mismo período exactamente al mismo tiempo.
 *
 * Ajusta ROOM_ID, CHECK_IN y CHECK_OUT
 */

const BASE_URL = 'http://localhost:8080/api';

const ROOM_ID  = 5;
const CHECK_IN  = '2026-05-01';
const CHECK_OUT = '2026-05-04';

const guests = [
  { guestFirstName: 'Ana',   guestLastName: 'López',   guestEmail: 'ana@test.com' },
  { guestFirstName: 'Pedro', guestLastName: 'Ramírez', guestEmail: 'pedro@test.com' },
];

async function createReservation(guest, index) {
  const body = {
    roomId: ROOM_ID,
    checkIn: CHECK_IN,
    checkOut: CHECK_OUT,
    guestCount: 1,
    ...guest,
  };

  const start = Date.now();
  const res = await fetch(`${BASE_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const ms = Date.now() - start;

  return { index: index + 1, status: res.status, data, ms };
}

// Ambas peticiones salen al mismo tiempo
const [r1, r2] = await Promise.all([
  createReservation(guests[0], 0),
  createReservation(guests[1], 1),
]);

for (const r of [r1, r2]) {
  const icon = r.status === 201 ? '✅' : '❌';
  console.log(`\n${icon} Request ${r.index} — HTTP ${r.status} (${r.ms}ms)`);
  console.log(JSON.stringify(r.data, null, 2));
}

const winner = [r1, r2].find(r => r.status === 201);
const loser  = [r1, r2].find(r => r.status !== 201);

console.log('\n─────────────────────────────────');
if (winner && loser) {
  console.log(`✅ Concurrencia manejada correctamente.`);
  console.log(`   Ganó:  Request ${winner.index}`);
  console.log(`   Perdió: Request ${loser.index} → ${loser.data.error}`);
} else {
  console.log('⚠️  Resultado inesperado — revisa los logs del servidor.');
}
