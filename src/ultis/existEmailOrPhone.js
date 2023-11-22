const existEmailOrPhone = async (request) => {
    const result = await request.query(`
            SELECT * FROM [User] 
            WHERE 
                Email like @Email 
                OR Phone like @Phone
        `);
    return result.recordset;
}
export default existEmailOrPhone;