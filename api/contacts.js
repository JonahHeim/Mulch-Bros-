export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY) {
    return res.status(500).json({ error: 'GHL API key not configured' });
  }

  try {
    const body = req.body;

    const ghlBody = {
      firstName: body.name ? body.name.split(' ')[0] : '',
      lastName: body.name ? body.name.split(' ').slice(1).join(' ') : '',
      email: body.email,
      phone: body.phone,
      address1: body.address1,
      tags: body.tags || [],
      customFields: [],
    };

    if (GHL_LOCATION_ID) {
      ghlBody.locationId = GHL_LOCATION_ID;
    }

    // Convert customField object to customFields array
    if (body.customField) {
      for (const [key, value] of Object.entries(body.customField)) {
        ghlBody.customFields.push({ id: key, field_value: value });
      }
    }

    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify(ghlBody),
    });

    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('GHL contacts error:', err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
}
