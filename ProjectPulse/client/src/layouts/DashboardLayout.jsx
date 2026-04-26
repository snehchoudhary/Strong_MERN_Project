import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";

function DashboardLayout({ children }) {

  return (

    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Section */}

      <div className="flex-1 flex flex-col">

        {/* Top Header */}

        <header
          className="
            flex
            justify-end
            items-center
            bg-white
            shadow
            px-6
            py-3
          "
        >

          <NotificationBell />

        </header>

        {/* Page Content */}

        <main
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >

          {children}

        </main>

      </div>

    </div>

  );

}

export default DashboardLayout;