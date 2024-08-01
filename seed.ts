import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart_item.entity';
import { CartStatuses } from 'src/cart/models/models';
import { appDataSource } from 'src/typeorm.config';
import { User } from 'src/users/entities/user.entity';

async function seed() {
  const userRepository = appDataSource.getRepository(User);

  // Insert user
  const user = userRepository.create({
    id: 'e46a984f-d05e-4867-beaa-29af28197f8c',
    name: 'egatsak',
    password: 'TEST_PASSWORD',
    email: 'egatsak@mail.com',
  });
  await userRepository.save(user);

  // Insert cart
  const cartRepository = appDataSource.getRepository(Cart);
  const cart = cartRepository.create({
    id: 'cfc260b1-3811-4f0d-8204-fe6d9f3f8cc4',
    userId: 'e46a984f-d05e-4867-beaa-29af28197f8c',
    createdAt: new Date('2024-07-23T08:27:02.556Z'),
    updatedAt: new Date('2024-07-23T08:27:02.556Z'),
    status: CartStatuses.OPEN,
  });
  await cartRepository.save(cart);

  // Insert cart item
  const cartItemRepository = appDataSource.getRepository(CartItem);
  const cartItem = cartItemRepository.create({
    cartId: cart.id,
    product: {
      description: 'Short Product Description2',
      id: '3533593e-e2de-43ba-9e45-2bd9f2f2273c',
      price: 23,
      title: 'Product',
    },
    count: 1,
  });
  await cartItemRepository.save(cartItem);

  console.log('Seeding completed successfully!');
}

seed().catch((error) => console.error('Error seeding the database', error));
