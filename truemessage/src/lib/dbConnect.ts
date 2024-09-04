import mongoose from "mongoose";
import { moveMessagePortToContext } from "worker_threads";

type ConnectionObject = {
    isConnected?:number;
    useNewUrlParser? : boolean
}

const connection: ConnectionObject = {}

export default async function dbConnect ():Promise<void> {
      if (connection.isConnected) {
        console.log('Already connected to database')
        return
      }
      try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        console.log(process.env.MONGODB_URI);
      
        // console.log(`dataBase: ${mongoose.connection}`)
        // console.log(`database2 : ${mongoose.connection.readyState}`)
       connection.isConnected = db.connections[0].readyState;
    
      } catch (error) {
        console.log(`DataBase Some reason are not Connected ${error}: ${error}`)
        process.exit(1)
      }
}