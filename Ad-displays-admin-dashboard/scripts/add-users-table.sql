-- Create Users table for authentication
CREATE TABLE [dbo].[User] (
    [id] INT IDENTITY(1,1) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    [name] NVARCHAR(100) NULL,
    [roles] NVARCHAR(100) NOT NULL DEFAULT 'user',
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [isActive] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [UQ_User_email] UNIQUE NONCLUSTERED ([email] ASC)
);

-- Insert default admin user
INSERT INTO [dbo].[User] ([email], [password], [name], [roles]) 
VALUES ('musab.kozlic@pennyplus.com', '$2b$10$placeholder_hash_will_be_replaced', 'Musab Kozlic', 'user,admin,writer');
