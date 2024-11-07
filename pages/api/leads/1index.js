// pages/api/leads/index.js

import dbConnect from '../../../utils/database/mongodb';
import Lead from '../../../models/Lead';


export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { name, email, phone } = req.body;
             
            // Check required fields
             if (!name || !email || !phone) {
                return res.status(400).json({ error: 'Missing required fields: name, email, or phone' });
            }

            const newLead = new Lead({ name, email, phone });
            await newLead.save();
            return res.status(201).json(newLead);

        } catch (error) {
            console.error('Error creating lead:', error); // Log the actual error
            return res.status(500).json({ error: 'Error creating lead', details: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const leads = await Lead.find({});
            return res.status(200).json(leads);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching leads' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}