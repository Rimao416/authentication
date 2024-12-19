import { UserInfo } from "@/components/user-info"
import { currentUser } from "@/lib/auth"

const ServerPage=async ()=>{
    const user=await currentUser()
    return(
        <div className="bg-white p-10 rounded-xl"> 
            <UserInfo user={user} label="Server" />
        </div>
    )
}

export default ServerPage