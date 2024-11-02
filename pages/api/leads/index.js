// pages/api/leads/index.js

import dbConnect from '../../../utils/mongodb';
import Lead from '../../../models/Lead';


export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { name, email, phone, optInVideo, bookingLink } = req.body;
             
            // Check required fields
             if (!name || !email || !phone) {
                return res.status(400).json({ error: 'Missing required fields: name, email, or phone' });
            }

            const newLead = new Lead({ name, email, phone, optInVideo, bookingLink });
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

    // const { method } = req;

    // switch (method) {
    //     case 'GET':
    //         try {
    //             const leads = await Lead.find({});
    //             res.status(200).json({ success: true, data: leads });
    //         } catch (error) {
    //             res.status(400).json({ success: false, message: "Error fetching leads", error });
    //         }
    //         break;

    //     case 'POST':
    //         try {
    //             const { name, email, phone, source } = req.body;
                
    //             // Basic validation (expand as needed)
    //             if (!name || !email) {
    //                 return res.status(400).json({ success: false, message: "Name and Email are required" });
    //             }

    //             const newLead = new Lead({
    //                 name,
    //                 email,
    //                 phone,
    //                 source
    //             });
                
    //             const savedLead = await newLead.save();
    //             res.status(201).json({ success: true, data: savedLead });
    //         } catch (error) {
    //             res.status(400).json({ success: false, message: "Error creating lead", error });
    //         }
    //         break;

    //     default:
    //         res.setHeader('Allow', ['GET', 'POST']);
    //         res.status(405).end(`Method ${method} Not Allowed`);
    //         break;
    // }

}