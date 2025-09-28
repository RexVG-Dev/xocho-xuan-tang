"use client"

import { Summary } from "./summary";
import { LowProductsStock } from "./lowProductsStock";
import { RecentOrders } from "./recentOrders";

function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-1 flex flex-col gap-6">
          <Summary />
          <LowProductsStock />
        </div>

        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

      </div>
    </div>
  )
}
export default Dashboard