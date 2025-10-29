/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[role_types] (
    [id] INT NOT NULL IDENTITY(1,1),
    [role_name] VARCHAR(50) NOT NULL,
    CONSTRAINT [RoleType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__role_typ__783254B127198EFD] UNIQUE NONCLUSTERED ([role_name])
);

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [role_id] INT NOT NULL,
    [created_at] DATETIME CONSTRAINT [DF__roles__created_a__619B8048] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME CONSTRAINT [DF__roles__updated_a__628FA481] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserRoles_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] VARCHAR(255) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [name] VARCHAR(100),
    [createdAt] DATETIME NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [User_isActive_df] DEFAULT 1,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[roles] ADD CONSTRAINT [FK_UserRoles_Role] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role_types]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[roles] ADD CONSTRAINT [FK_UserRoles_User] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
