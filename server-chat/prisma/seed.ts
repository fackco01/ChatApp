import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Định nghĩa roles với roleId cụ thể
  const roles = [
    { roleId: 1, roleName: 'Admin' },
    { roleId: 2, roleName: 'User' },
  ];

  // Sử dụng createMany để insert nhiều records cùng lúc
  await prisma.role.deleteMany({}); // Xóa tất cả records cũ (optional)

  // Insert các roles mới với roleId cụ thể
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true, // Bỏ qua nếu đã tồn tại
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });