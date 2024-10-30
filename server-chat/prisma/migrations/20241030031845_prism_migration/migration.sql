-- CreateTable
CREATE TABLE "auths" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "auths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "roleId" SERIAL NOT NULL,
    "roleName" VARCHAR(255) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleId")
);

-- AddForeignKey
ALTER TABLE "auths" ADD CONSTRAINT "auths_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
