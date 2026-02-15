export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY) {
    return res.status(500).json({ error: 'GHL API key not configured' });
  }

  if (!GHL_LOCATION_ID) {
    return res.status(500).json({ error: 'GHL location ID not configured' });
  }

  try {
    const body = req.body;

    const ghlBody = {
      locationId: GHL_LOCATION_ID,
      firstName: body.name ? body.name.split(' ')[0] : '',
      lastName: body.name ? body.name.split(' ').slice(1).join(' ') : '',
      email: body.email,
      phone: body.phone,
      address1: body.address1,
      source: body.source || 'Virtual Quote Tool',
      tags: body.tags || [],
      customFields: [],
    };

    // Convert customField object to customFields array
    if (body.customField) {
      for (const [key, value] of Object.entries(body.customField)) {
        ghlBody.customFields.push({ key: key, field_value: value });
      }
    }

    console.log('Sending to GHL:', JSON.stringify(ghlBody, null, 2));

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
    console.log('GHL response:', response.status, JSON.stringify(data));

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || data.msg || JSON.stringify(data), ghlStatus: response.status });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('GHL contacts error:', err);
    res.status(500).json({ error: 'Failed to create contact: ' + err.message });
  }
}
