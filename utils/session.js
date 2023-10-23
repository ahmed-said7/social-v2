require('dotenv').config();

const firstStep=async (user,price)=>{
    const res=await fetch('https://accept.paymob.com/api/auth/tokens',{
        method:'POST',
        headers:{ "Content-Type" : "application/json" },
        body: JSON.stringify({ api_key : process.env.API_KEY })
    });
    const token=(await res.json()).token;
    const id=await secondStep(token,price);
    const authToken=await thirdStep(token,id,user,price);
    const url=iframeLink(authToken);
    return {url,id};
};
const secondStep=async (token,price) => {
    const data=
    {
        "auth_token":  token,
        "delivery_needed": "false",
        "amount_cents": price,
        "currency": "EGP",
        "items": [],
    };
    const res=await fetch('https://accept.paymob.com/api/ecommerce/orders',{
        method:'POST',
        headers:{ "Content-Type" : "application/json" },
        body: JSON.stringify(data)
    });
    const id=(await res.json()).id;
    return id;
}
const thirdStep=async (token,id,user,price)=>{
    const data={
        "auth_token": token,
        "amount_cents": price, 
        "expiration": 3600, 
        "order_id": id,
        "billing_data": {
            "apartment": "null", 
            "email": user?.email || "null",  
            "floor": "null", 
            "first_name": user?.username || "null", 
            "street": "null", 
            "building": "null", 
            "phone_number": "null", 
            "shipping_method": "null", 
            "postal_code": "null", 
            "city": "null", 
            "country": "null", 
            "last_name": "null", 
            "state": "null"
        }, 
        "currency": "EGP", 
        "integration_id": process.env.INTEGRATION_ID, 
    };
    const res=await fetch('https://accept.paymob.com/api/acceptance/payment_keys',{
        method:'POST',
        headers:{ "Content-Type" : "application/json" },
        body: JSON.stringify(data)
    });
    const authToken=(await res.json()).token;
    return authToken;
};
const iframeLink=(token)=>{
    return `https://accept.paymob.com/api/acceptance/iframes/${process.env.IFRAME}?payment_token=${token}`
};
module.exports=firstStep;