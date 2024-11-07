// app/api/leads/[id]/route.js

import dbConnect from '../../../../utils/database/mongodb';
import Lead from '../../../../models/Lead';

export async function PATCH(req, { params }) {
    await dbConnect();
    const { id } = params;
    const data = await req.json();

    try {
        const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true });
        return new Response(JSON.stringify(updatedLead), { status: 200 });
    } catch (error) {
        return new Response('Error updating lead', { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        await Lead.findByIdAndDelete(id);
        return new Response('Lead deleted successfully', { status: 200 });
    } catch (error) {
        return new Response('Error deleting lead', { status: 500 });
    }
}