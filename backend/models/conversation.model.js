import express from "express";
import mongoose from "mongoose";
import { Timestamp } from "mongodb";

const conversationSchema=new mongoose.Schema(
    {
        participants:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            }
        ],
        messages:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            default:[],
            }

        ]
    },
    {
        timestamps:true
    }
);

const Conversation=mongoose.model("Conversation",conversationSchema);

export default Conversation;