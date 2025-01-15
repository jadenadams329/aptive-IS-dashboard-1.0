import { useSelector } from "react-redux"
import SalesTrackerTable from "./SalesTrackerTable"
import NewSaleButton from "../NewSaleButton/NewSaleButton"

function SalesTrackerPage() {
    const sessionUser = useSelector(state => state.session.user)
  return (
    <>
        <div>
            <h1>Sales Tracker</h1>
            <p>Welcome to the Sales Tracker Page, {sessionUser.username}!</p>
            <NewSaleButton />
        </div>
        <div>
            <SalesTrackerTable />
        </div>
    </>
  )
}

export default SalesTrackerPage
