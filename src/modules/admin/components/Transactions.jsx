// import { Card, CardContent, CardHeader } from "@/components/ui/card";

const transactions = [
  {
    id: 1,
    type: "Receive",
    from: "Vân Nhi",
    amount: "$87",
    time: "11:24 AM",
    avatar: "VN",
  },
  {
    id: 2,
    type: "Receive",
    from: "Hoàng Hiệp", 
    amount: "$125",
    time: "11:55 PM",
    avatar: "HH",
  },
  {
    id: 3,
    type: "Receive",
    from: "Song Thiên",
    amount: "$25", 
    time: "02:40 AM",
    avatar: "ST",
  },
];

export default function Transactions() {
  return (
    <div className="shadow-lg border-0 rounded-xl p-6 bg-white">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Giao dịch</h3>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            View All
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md border border-gray-100"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-semibold text-sm">
                {transaction.avatar}
              </span>
            </div>
            
            {/* Transaction Info */}
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">
                {transaction.type}
              </div>
              <div className="text-xs text-gray-500">
                From : {transaction.from}
              </div>
            </div>
            
            {/* Amount and Time */}
            <div className="text-right">
              <div className="text-sm font-bold text-purple-600">
                {transaction.amount}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {transaction.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
