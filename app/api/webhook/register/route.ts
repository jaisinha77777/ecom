// locahost:3000/api/webhook/register -> does not work 

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
// so we use local tunnel to expose our local server to the internet
export async function POST(request: NextRequest) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Webhook secret not set" }, { status: 500 });
    }

    const signature = (await headers()).get("svix-signature");
    const timestamp = (await headers()).get("svix-timestamp");
    const id = (await headers()).get("svix-id");

    const payload = JSON.stringify(await request.json());

    const webhook = new Webhook(WEBHOOK_SECRET);

    if (!signature || !timestamp || !id) {
        return NextResponse.json({ error: "Missing signature, timestamp or id" }, { status: 400 });
    }


    let evt: WebhookEvent;


    
    try {
        console.log(id, timestamp, signature);
        
        evt = webhook.verify(payload, {
            "svix-id": id!,
            "svix-timestamp": timestamp!,
            "svix-signature": signature!,
        }) as WebhookEvent
        console.log(evt); // try console logging it 

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

    }

    const { id: evtId } = evt.data;
    const evtType = evt.type;

    if (evtType === "user.created") {
        const { email_addresses, primary_email_address_id } = evt.data
        const primaryEmail = email_addresses.find((email) => email.id === primary_email_address_id)
        if (!primaryEmail) {
            return NextResponse.json({ error: "No primary email found" }, { status: 400 });
        }

        try {
            const user = await prisma.user.create({
                data: {

                    id: evtId,
                    email: primaryEmail.email_address,
                    name : evt.data.first_name + " " + evt.data.last_name,
                    role : "USER" // default role
                }
            }
            );
        } catch (error : any) {
            return NextResponse.json({ error: "Error creating user", message : error.message }, { status: 500 });
        }
        
    }
    return NextResponse.json({ "message": "Webhook recieved" }, { status: 200 });
}