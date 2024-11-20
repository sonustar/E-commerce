import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import ChatBot from "react-chatbotify";
import "./App.css"

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  const flow = {
    start: {
      message: "Hello, How can I help you?",
      options: ["I want to buy items", "No"],
      path: (params) => {
        if (params.userInput === "I want to buy items") {
          return "accept";
        } else if (params.userInput === "No") {
          return "decline";
        } else {
          return "write";
        }
      },
    },
    write: {
      message: "Please sir, choose from the Options",
      transition: 1000,
      path: "start",
    },

    accept: {
      message: "Tell me, What do you want to buy?",
      options: ["categories", "items"],
      path: (params) => {
        if (params.userInput === "categories") {
          return "categories";
        } else {
          return "products";
        }
      },
    },

    categories: {
      message: "Let's give you some categories to buy!!",
      options: ["Groceries", "Watches", "Books", "T-shirts", "Mobiles", "Everyday", "Shoes"],
      path: (params) => {
        const userInput = params.userInput.toLowerCase();
        const categories = ["groceries", "watch", "Books", "T-shirts", "mobiles", "Everyday", "Shoes"];

        if (userInput.includes("shoes")) {
          return "shoes";
        } else if (userInput.includes("watches")) {
          return "watches";
        } else if (userInput.includes("books")) {
          return "books";
        } else if (userInput.includes("mobiles")) {
          return "mobiles";
        } else if (userInput.includes("everyday")) {
          return "everyday";
        } else {
          return "others";
        }
      },
    },

    others: {
      message: "This item might not be present in the stock but still have a look, sir",
      path: "start",
    },

    shoes: {
      message: "Here are some shoes you might like: Shoes",
      options: ["Nike", "Adidas", "Puma"],
    },

    watches: {
      message: "Here are some watches you might like: Watches",
      options: ["Titan", "Rolex", "Sonata"],
    },

    books: {
      message: "Here are some books available you might like: Books",
      options: ["Tom and Jerry", "Harry Potter", "Rabindranath Tagore books"],
    },

    mobiles: {
      message: "Here are some mobiles you might like: Mobiles",
      options: ["Redmi", "Vivo", "iPhone"],
    },

    everyday: {
      message: "Here are some everyday items you might like: Everyday",
      options: ["Tata Salt", "Tata Gold", "Pressure Cooker"],
    },

    decline: {
      message: "Please sir, You can explore our website, Hope you find some relevant items to buy 😊",
      options: ["See the categories"],
      path: (params) => {
        if (params.userInput === "See the categories") {
          return "accept";
        } else {
          return "write";
        }
      },
    },

    change_mind: {
      message: "I see you changed your mind, let me get you the passage!",
      transition: 1000,
      path: "accept",
    },

    ask_repeat: {
      message: "That's all for the passage, would you like me to repeat?",
      options: ["Yes", "No"],
      path: (params) => {
        if (params.userInput === "Yes") {
          return "accept";
        } else {
          return "decline";
        }
      },
    },
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
       
      <div className="chatbot-wrapper">
        <ChatBot 
        flow={flow} />
      </div>

    </div>
  );
}

export default App;
