const {createHmac} =require('crypto');
require('dotenv').config();

const createHash=(req)=>{
    const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order: { id: order_id },
        owner,
        pending,
        source_data: {
            pan: source_data_pan,
            sub_type: source_data_sub_type,
            type: source_data_type,
        },
        success,
        } = req.body.obj;
        
        const stringHmac =
        amount_cents +
        created_at +
        currency +
        error_occured +
        has_parent_transaction +
        id +
        integration_id +
        is_3d_secure +
        is_auth +
        is_capture +
        is_refunded +
        is_standalone_payment +
        is_voided +
        order_id +
        owner +
        pending +
        source_data_pan +
        source_data_sub_type +
        source_data_type +
        success;

        const hashed=createHmac("sha512", process.env.HMAC)
        .update(stringHmac)
        .digest("hex");
        return { order_id , hashed};
};

module.exports=createHash;