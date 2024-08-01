import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { TransactionType } from "../types/transaction";
import { formatDate } from "../utils/formatDate";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";

interface CardProps {
  transaction?: TransactionType;
  authUser?: any;
}

const Card = ({ transaction, authUser }: CardProps) => {
  const [deleteTransactionMutation, { loading }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: ["getTransactions"],
    }
  );

  const handleDelete = async () => {
    try {
      await deleteTransactionMutation({
        variables: {
          transactionId: transaction?._id,
        },
      });
      toast.success("Transaction deleted successfully");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };
  return (
    <div
      className={clsx(
        "rounded-md p-4 bg-gradient-to-br",
        { "from-green-700 to-green-400": transaction?.category === "saving" },
        { "from-pink-800 to-pink-600": transaction?.category === "expense" },
        { "from-blue-700 to-blue-400": transaction?.category === "investment" }
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {transaction?.category}
          </h2>
          <div className="flex items-center gap-2">
            {!loading ? (
              <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
            ) : (
              <div className="w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin"></div>
            )}
            <Link to={`/transaction/${transaction?._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {transaction?.description}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {transaction?.paymentType}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: ${transaction?.amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Location: {transaction?.location}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">
            {formatDate(transaction?.date)}
          </p>
          <img
            src={authUser?.profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default Card;
