/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `images` table. All the data in the column will be lost.
  - Added the required column `fileType` to the `images` table without a default value. This is not possible if the table is not empty.
  - Made the column `filename` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isActive` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `images` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[images] ALTER COLUMN [filename] VARCHAR(100) NOT NULL;
ALTER TABLE [dbo].[images] ALTER COLUMN [isActive] BIT NOT NULL;
ALTER TABLE [dbo].[images] ALTER COLUMN [updatedAt] DATETIME NOT NULL;
ALTER TABLE [dbo].[images] DROP COLUMN [imageUrl];
ALTER TABLE [dbo].[images] ADD CONSTRAINT [images_isActive_df] DEFAULT 1 FOR [isActive];
ALTER TABLE [dbo].[images] ADD [createdAt] DATETIME NOT NULL CONSTRAINT [images_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[fileSize] VARCHAR(20),
[fileType] VARCHAR(20) NOT NULL,
[groupName] VARCHAR(100),
[originalName] VARCHAR(100);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] VARCHAR(255) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [name] VARCHAR(100),
    [roles] VARCHAR(100) NOT NULL CONSTRAINT [User_roles_df] DEFAULT 'user',
    [createdAt] DATETIME NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [User_isActive_df] DEFAULT 1,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
