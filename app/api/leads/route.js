

// app/api/leads/route.js


import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import dbConnect from '../../../utils/database/mongodb';
import Lead from '../../../models/Lead';


// Handler for GET and POST requests
export async function GET(req) {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Retrieve search, filter, page, and limit from the URL query parameters
        const { search, filter, page = 1, limit = 10 } = Object.fromEntries(new URL(req.url).searchParams);

        const query = {};

        // Add search condition
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Add filter condition if a specific filter is selected
        if (filter && filter !== 'All') {
            query.status = filter;
        }
        
        // Pagination settings
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Retrieve filtered and paginated leads from the database
        const leads = await Lead.find(query).skip(skip).limit(limitNumber);
        const totalLeads = await Lead.countDocuments(query);
        const totalPages = Math.ceil(totalLeads / limitNumber);

        // Return the leads and pagination information
        return NextResponse.json({ leads, totalPages }, { status: 200 });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, phone } = await req.json();

        // Save lead data to database
        const newLead = new Lead({ name, email, phone });
        await newLead.save();

        return new Response(JSON.stringify({ message: 'Lead saved successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving lead:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

//