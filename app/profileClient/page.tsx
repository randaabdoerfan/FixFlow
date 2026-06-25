"use client"
import Sidebar from '../component/sidebar/sidebar'
import ClientTicket from './[clientTicket]/page'

function ProfileClient() {
  return (
    <div>
      <Sidebar role="client" />
      <ClientTicket/>
      
    </div>
  )
}

export default ProfileClient
