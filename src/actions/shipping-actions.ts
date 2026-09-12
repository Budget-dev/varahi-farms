'use server';

/**
 * @fileOverview Server actions for NimbusPost shipping integration.
 * Handles authentication and shipment creation securely.
 */

const NIMBUS_EMAIL = process.env.NIMBUSPOST_EMAIL || '';
const NIMBUS_PASSWORD = process.env.NIMBUSPOST_PASSWORD || '';
const API_URL = 'https://api.nimbuspost.com/v1';

/**
 * Authenticates with NimbusPost to get a temporary bearer token.
 */
async function getNimbusToken() {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: NIMBUS_EMAIL, password: NIMBUS_PASSWORD }),
    });
    const data = await res.json();
    return data.status ? data.data : null;
  } catch (error) {
    console.error('NimbusPost Auth Error:', error);
    return null;
  }
}

/**
 * Creates a shipment in NimbusPost.
 * Called after successful payment.
 */
export async function createShipment(orderData: any) {
  try {
    const token = await getNimbusToken();
    if (!token) throw new Error('Failed to authenticate with shipping partner.');

    const payload = {
      order_number: orderData.orderId,
      shipping_charges: 0,
      discount: 0,
      cod: 0, // 0 for Prepaid
      payment_method: 'Prepaid',
      consignee: {
        name: orderData.shippingAddress.name,
        address: orderData.shippingAddress.address,
        address_2: '',
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        pincode: orderData.shippingAddress.pincode,
        phone: orderData.shippingAddress.phone,
        email: orderData.userEmail,
      },
      order_items: orderData.items.map((item: any) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        sku: item.id,
      })),
      package_weight: 500, // Default weight in grams
      package_length: 10,
      package_width: 10,
      package_height: 10,
    };

    const res = await fetch(`${API_URL}/shipments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.status) {
      return {
        success: true,
        shipmentId: result.data.shipment_id,
        trackingId: result.data.awb_number,
        courierName: result.data.courier_name,
      };
    } else {
      console.error('NimbusPost Create Shipment Error:', result.message);
      return { success: false, error: result.message || 'Shipment creation failed' };
    }
  } catch (error: any) {
    console.error('Shipping Action Error:', error);
    return { success: false, error: error.message };
  }
}
