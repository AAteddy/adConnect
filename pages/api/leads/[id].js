// pages/api/leads/[id].js

import dbConnect from '../../../utils/mongodb';
import Lead from '../../../models/Lead';

export default async function handler(req, res) {
    await dbConnect();

    
    const { id } = req.query; // Get the `id` parameter from the URL

    if (req.method === 'GET') {
        try {
            const lead = await Lead.findById(id);
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            return res.status(200).json(lead);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching lead' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { name, email, phone, status, optInVideo, bookingLink } = req.body;
            
            // Validate required fields
            if (!name || !email) {
                return res.status(400).json({ success: false, message: "Name and Email are required" });
            }
            
            // Prepare the update data to match schema, including nested structures
            const updateData = {
                name,
                email,
                phone,
                status,
                optInVideo: {
                    url: optInVideo?.url || null,
                    watched: optInVideo?.watched || false
                },
                bookingLink
            };

            const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            return res.status(200).json(lead);
        } catch (error) {
            return res.status(500).json({ error: 'Error updating lead' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const lead = await Lead.findByIdAndDelete(id);
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            return res.status(200).json({ message: 'Lead deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting lead' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
    // switch (method) {
    //     case 'PUT':
    //         try {
    //             const { name, email, phone, source } = req.body;

    //             // Validate fields (adjust as needed for your app)
    //             if (!name || !email) {
    //                 return res.status(400).json({ success: false, message: "Name and Email are required" });
    //             }

    //             const updatedLead = await Lead.findByIdAndUpdate(
    //                 id,
    //                 { name, email, phone, source },
    //                 { new: true, runValidators: true }
    //             );

    //             if (!updatedLead) {
    //                 return res.status(404).json({ success: false, message: "Lead not found" });
    //             }

    //             res.status(200).json({ success: true, data: updatedLead });
    //         } catch (error) {
    //             res.status(400).json({ success: false, message: "Error updating lead", error });
    //         }
    //         break;

    //     case 'DELETE':
    //         try {
    //             const deletedLead = await Lead.findByIdAndDelete(id);

    //             if (!deletedLead) {
    //                 return res.status(404).json({ success: false, message: "Lead not found" });
    //             }

    //             res.status(200).json({ success: true, message: "Lead deleted successfully" });
    //         } catch (error) {
    //             res.status(400).json({ success: false, message: "Error deleting lead", error });
    //         }
    //         break;

    //     default:
    //         res.setHeader('Allow', ['PUT', 'DELETE']);
    //         res.status(405).end(`Method ${method} Not Allowed`);
    //         break;
    // }
