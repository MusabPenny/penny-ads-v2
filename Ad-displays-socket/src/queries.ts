const { getConnection } = require('./db');

async function fetchPosImages() { 
    const pool = await getConnection();
        const request = pool.request();

        try {
            request.input('isImageForAllPos', true);
            const result = await request.query('SELECT imageUrl, fileType FROM images WHERE isImageForAllPos = @isImageForAllPos');
            return result.recordset;
        } catch (error) {
            console.error("Error fetching POS images:", error);
            throw error;
        }
}

async function fetchAllImagesForDisplays() {
    const pool = await getConnection();
    const request = pool.request();

    request.input('isActive', true);
    request.input('isImageForAllLocations', true);

    try {
        const result = await request.query('select * from images where isActive = @isActive and isImageForAllLocations = @isImageForAllLocations;');
        return result.recordset;
    } catch (error) {
        console.error("Error fetching all images for displays:", error);
        throw error;
    }
}


export { fetchPosImages, fetchAllImagesForDisplays };