// app/api/leads/[id]/status/route.js

import dbConnect from '../../../../../utils/database/mongodb';
import Lead from '../../../../../models/Lead';

export async function PUT(req, { params }) {
    await dbConnect();
    const { id } = params;
    const { status } = await req.json();

    try {
        const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
        return new Response(JSON.stringify(lead), { status: 200 });
    } catch (error) {
        return new Response('Error updating lead status', { status: 500 });
    }
}