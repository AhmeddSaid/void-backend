const generateOrderEmail = (order, frontendUrl) => {
  // 1. UPLOAD LOGO: Upload 'logo-w.png' to Imgur/Discord/etc and paste the link here.
  // Example: "https://i.imgur.com/yourlogo.png"
  const logoUrl = "https://i.ibb.co/d0qWZmsh/Logo-main-white.png"; 
  // ^^^ REPLACE THIS STRING WITH YOUR UPLOADED LOGO URL ^^^
  
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paymentMethodLabel =
    order.paymentMethod === "COD" ? "Cash on Delivery" : "Instapay Payment";

  const discountRow = (order.coupon && order.coupon.code)
    ? `
    <tr>
        <td style="padding: 8px 0; color: #4ade80;">Discount (${order.coupon.code})</td>
        <td style="padding: 8px 0; text-align: right; color: #4ade80;">- ${order.coupon.discountType === "PERCENTAGE" ? "" : "EGP"} ${order.coupon.discount}${order.coupon.discountType === "PERCENTAGE" ? "%" : ""}</td>
    </tr>`
    : "";

  const itemsList = order.orderItems
    .map(
      (item) => `
      <div style="display: flex; align-items: center; border-bottom: 1px solid #222; padding: 15px 0;">
        <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 85px; object-fit: cover; border-radius: 2px; margin-right: 20px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #fff;">${item.name}</h4>
          <p style="margin: 0; font-size: 12px; color: #888;">${item.size} / ${item.color}</p>
          <p style="margin: 5px 0 0 0; font-size: 11px; color: #555;">QTY: ${item.qty}</p>
        </div>
        <div style="font-weight: 500; font-size: 14px; color: #fff;">
          ${item.price * item.qty} EGP
        </div>
      </div>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      
      <!-- MAIN CONTAINER -->
      <div style="max-width: 600px; margin: 0 auto; background-color: #050505;">
        
        <!-- HEADER -->
        <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #222;">
          <img src="${logoUrl}" alt="VOID" style="max-width: 200px; height: auto;">
        </div>

        <!-- HERO SECTION -->
        <div style="padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">Order Confirmed</h1>
          <p style="margin: 0; font-size: 14px; color: #666;">Order #${order.order_id} • ${orderDate}</p>
        </div>

        <!-- ITEMS SECTION -->
        <div style="padding: 0 20px;">
          <div style="border-top: 1px solid #222;">
            ${itemsList}
          </div>
        </div>

        <!-- TOTALS SECTION (Table for better spacing) -->
        <div style="padding: 30px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #e5e5e5;">
            <tr>
              <td style="padding: 8px 0;">Subtotal</td>
              <td style="padding: 8px 0; text-align: right;">${order.itemsPrice} EGP</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Shipping</td>
              <td style="padding: 8px 0; text-align: right;">${order.shippingPrice} EGP</td>
            </tr>
            ${discountRow}
            <tr>
              <td style="padding-top: 20px; border-top: 1px solid #333; font-size: 20px; font-weight: 700; color: #fff;">TOTAL (Incl. VAT)</td>
              <td style="padding-top: 20px; border-top: 1px solid #333; font-size: 20px; font-weight: 700; color: #fff; text-align: right;">${order.totalPrice} EGP</td>
            </tr>
          </table>
        </div>

        <!-- DETAILS GRID -->
        <div style="padding: 20px; background-color: #111; margin: 20px; border-radius: 4px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #ccc;">
            <tr>
              <td width="50%" valign="top" style="padding-bottom: 20px; padding-right: 15px;">
                <h3 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #666;">Shipping Address</h3>
                <p style="margin: 0; line-height: 1.6;">
                  ${order.shippingAddress.fullName}<br>
                  ${order.shippingAddress.address}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.governorate}<br>
                  ${order.shippingAddress.phoneNumber}
                </p>
              </td>
              <td width="50%" valign="top" style="padding-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #666;">Payment Method</h3>
                <p style="margin: 0; line-height: 1.6;">
                  ${paymentMethodLabel}
                  ${
                    order.paymentResult && order.paymentResult.id
                      ? `<br><span style="font-size: 11px; color: #888;">Ref: ${order.paymentResult.id}</span>`
                      : ""
                  }
                </p>
              </td>
            </tr>
          </table>
          
          <div style="text-align: center; margin-top: 20px;">
             <a href="${frontendUrl}/order-success/${order._id}" style="display: inline-block; padding: 12px 30px; background-color: #fff; color: #000; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">View Full Receipt</a>
          </div>
        </div>

        <!-- FOOTER -->
        <div style="padding: 40px 20px; text-align: center; font-size: 11px; color: #444;">
          <p style="margin-bottom: 10px;">If you have any questions, reply to this email.</p>
          <p>© 2026 VOID. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};

const generateAbandonedCartEmail = (cart, frontendUrl) => {
  const logoUrl = "https://i.ibb.co/d0qWZmsh/Logo-main-white.png";

  const itemsList = cart.cartItems
      .slice(0, 3) // Show first 3 items only
      .map(
        (item) => `
        <div style="display: flex; align-items: center; border-bottom: 1px solid #222; padding: 15px 0;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 75px; object-fit: cover; border-radius: 2px; margin-right: 20px;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #fff;">${item.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #888;">${item.size} / ${item.color}</p>
          </div>
        </div>
      `
      )
      .join("");
  
  const remainingCount = cart.cartItems.length > 3 ? `+ ${cart.cartItems.length - 3} more items` : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You forgot something in the VOID</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: #050505; padding: 40px 20px;">
        
        <div style="text-align: center; border-bottom: 1px solid #222; padding-bottom: 30px;">
          <img src="${logoUrl}" alt="VOID" style="max-width: 150px; height: auto;">
        </div>

        <div style="text-align: center; padding: 40px 0;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">Wait...</h1>
          <p style="margin: 0; font-size: 14px; color: #888;">You left something behind. The void is calling.</p>
        </div>

        <div style="border-top: 1px solid #222; margin-bottom: 30px;">
            ${itemsList}
            ${remainingCount ? `<p style="text-align: center; color: #666; font-size: 12px; margin-top: 10px;">${remainingCount}</p>` : ''}
        </div>

        <div style="text-align: center;">
           <a href="${frontendUrl}/cart" style="display: inline-block; padding: 14px 40px; background-color: #fff; color: #000; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-radius: 2px;">Recover Cart</a>
        </div>
        
        <div style="padding: 40px 20px; text-align: center; font-size: 10px; color: #444;">
          <p>Don't want these reminders? Ignore this email and the void will consume it.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};

module.exports = { generateOrderEmail, generateAbandonedCartEmail };
