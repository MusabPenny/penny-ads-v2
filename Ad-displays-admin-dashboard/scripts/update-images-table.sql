-- Update images table structure for better file management
ALTER TABLE [dbo].[images] ADD [originalName] NVARCHAR(100) NULL;
ALTER TABLE [dbo].[images] ADD [groupName] NVARCHAR(100) NULL;
ALTER TABLE [dbo].[images] ADD [fileType] NVARCHAR(20) NOT NULL DEFAULT 'image';
ALTER TABLE [dbo].[images] ADD [fileSize] NVARCHAR(20) NULL;
ALTER TABLE [dbo].[images] ADD [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE();

-- Update existing columns
ALTER TABLE [dbo].[images] ALTER COLUMN [filename] NVARCHAR(100) NOT NULL;
ALTER TABLE [dbo].[images] ALTER COLUMN [isActive] BIT NOT NULL;
ALTER TABLE [dbo].[images] ADD DEFAULT 1 FOR [isActive];
