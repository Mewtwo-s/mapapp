'use strict'

const {db, models: {User, Session, UserSession} } = require('../server/db')

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ email: 'mac@mapapp.com', 
    password: '123',
  firstName:'mac',
  lastName:'mac',
  phoneNum:'888-888-8888',
  }),
  User.create({ email: 'joe@mapapp.com', 
  password: '123',
firstName:'joe',
lastName:'joe',
phoneNum:'888-888-8881',
}),
User.create({ email: 'hannah@mail.com', 
  password: 'hannah123',
firstName:'Hannah',
lastName:'Smith',
phoneNum:'111-111-1111',
}),
User.create({ email: 'iris@mail.com', 
  password: 'iris123',
firstName:'Iris',
lastName:'Smith',
phoneNum:'222-222-2222',
}),
  ])

  const sessions = await Promise.all([
    Session.create(),
    Session.create()
  ])
  // await sessions[0].setHost(users[2]);
  // await sessions[1].setHost(users[3]);
  await users[3].addHost(sessions[0]);
  await users[2].addHost(sessions[1]);
  await sessions[0].addUsers([users[0], users[2]], { through: {accepted: true}});
  await sessions[0].addUsers(users[1]);
  await sessions[1].addUsers(users[3], {through: {accepted: true}});
  await sessions[1].addUsers(users[2]);

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
  return {
    users: {
      mac: users[0],
      joe: users[1],
      hannah: users[2],
      iris: users[3]
    },
    sessions: {
      session1: sessions[0],
      session2: sessions[1]
    }
  }
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
