
"use client"
import Dashboard from '../bashboard/page'
import Sidebar from '../component/sidebar/sidebar'

function AdminProfile() {
  return (
    <div>
        <Sidebar role='admin'/>
        <Dashboard/>
    </div>
  )
}

export default AdminProfile
