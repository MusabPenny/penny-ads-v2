BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[clients] (
    [id] INT NOT NULL IDENTITY(1,1),
    [mac_address] VARCHAR(30) NOT NULL,
    [ip_address] VARCHAR(20),
    [connecting_timestamp] DATETIME,
    [client_location] VARCHAR(20),
    [socketId] VARCHAR(50),
    [connected] BIT,
    [enableWakeOnLan] BIT,
    CONSTRAINT [clients_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[images] (
    [id] INT NOT NULL IDENTITY(1,1),
    [filename] VARCHAR(100),
    [imageUrl] VARCHAR(100),
    [isActive] BIT,
    [updatedAt] DATETIME,
    [isImageForAllLocations] BIT,
    [expirationDate] DATETIME,
    CONSTRAINT [images_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[images_clients] (
    [image_id] INT NOT NULL,
    [client_id] INT NOT NULL,
    [isClientImageActive] BIT,
    CONSTRAINT [images_clients_pkey] PRIMARY KEY CLUSTERED ([image_id],[client_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[images_clients] ADD CONSTRAINT [images_clients_image_id_fkey] FOREIGN KEY ([image_id]) REFERENCES [dbo].[images]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[images_clients] ADD CONSTRAINT [images_clients_client_id_fkey] FOREIGN KEY ([client_id]) REFERENCES [dbo].[clients]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
