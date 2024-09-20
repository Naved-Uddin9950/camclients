import db from "../connection.js";

const useTableCheck = async (tableName) => {
    const [tableCheck] = await db.execute(`
        SELECT COUNT(*) AS tableExists 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = '${tableName}';
    `);

    if(tableCheck[0].tableExists === 0) return true;
    return false;
};

export default useTableCheck;