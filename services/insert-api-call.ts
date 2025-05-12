// insert-users.ts
import axios from 'axios';
import { faker } from '@faker-js/faker';

const API_URL = 'http://localhost:3000/api/user'; // Change this to your actual API

type User = {
  name: string;
  sex: string;
  dob: string;
  email: string;
  mobile: string;
  address: string;
};

function generateRandomUser(): User {
  return {
    name: faker.person.fullName(),
    sex: faker.helpers.arrayElement(['Male', 'Female']),
    dob: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
    email: faker.internet.email(),
    mobile: '01' + faker.string.numeric(9), // Bangladeshi mobile
    address: faker.location.streetAddress(),
  };
}


async function insertUsers(total: number, batchSize: number = 100) {
  for (let i = 1; i <= total; i++) {
    const user = generateRandomUser();
    const id = 100000 + i;

    try {
      await axios.post(`${API_URL}/${id}`, user);
    } catch (error: any) {
      console.error(`❌ Failed for ID ${id}:`, error.message);
    }

    if (i % batchSize === 0) {
      console.log(`✅ Inserted ${i} users`);
      await new Promise((resolve) => setTimeout(resolve, 200)); // Throttle
    }
  }
}

insertUsers(1).then(() => {
  console.log('🎉 Done inserting users!');
});
