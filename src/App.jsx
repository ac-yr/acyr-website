import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/framework/Layout'
import BrandLayout from './components/framework/BrandLayout'
import Landing from './pages/Landing'
import Styleguide from './pages/Styleguide'
import Reference from './pages/Reference'
import Acyr from './pages/Acyr'
import Gallery from './pages/Gallery'
import NotFound from './pages/NotFound'
import Editor from './editor/Editor'

import SiteLayout from './components/site/SiteLayout'
import Home from './pages/site/Home'
import Blog from './pages/site/Blog'
import BlogArticle from './pages/site/BlogArticle'
import BlogAuthor from './pages/site/BlogAuthor'
import Collections from './pages/site/Collections'
import CollectionDetail from './pages/site/CollectionDetail'
import Shop from './pages/site/Shop'
import Handmade from './pages/site/Handmade'
import ProductDetail from './pages/site/ProductDetail'
import Contact from './pages/site/Contact'
import About from './pages/site/About'
import Privacy from './pages/site/Privacy'
import Terms from './pages/site/Terms'
import ShippingReturns from './pages/site/ShippingReturns'
import Cart from './pages/site/Cart'
import Checkout from './pages/site/Checkout'
import OrderConfirmation from './pages/site/OrderConfirmation'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<BrandLayout />}>
          <Route path="/"           element={<Landing />} />
          <Route path="/styleguide" element={<Styleguide />} />
          <Route path="/reference"      element={<Reference />} />
          <Route path="/acyr"           element={<Acyr />} />
          <Route path="/gallery"    element={<Gallery />} />

          <Route path="/editor/:mode" element={<Editor />} />
          <Route path="/editor"       element={<Navigate to="/editor/compose" replace />} />

          {/* Legacy redirects into the unified editor — keep for backward compat
              with any pre-init-editor URLs that linked to /generators/*. */}
          <Route path="/generators"             element={<Navigate to="/editor/compose" replace />} />
          <Route path="/generators/combo-lab"   element={<Navigate to="/editor/palette" replace />} />
          <Route path="/generators/pattern-lab" element={<Navigate to="/editor/pattern" replace />} />
          <Route path="/generators/type-lab"    element={<Navigate to="/editor/type"    replace />} />
          <Route path="/compose"                element={<Navigate to="/editor/compose" replace />} />
        </Route>

        {/* Marketing site — single brand */}
        <Route element={<SiteLayout />}>
          <Route path="/site"                          element={<Home />} />
          <Route path="/site/about"                    element={<About />} />
          <Route path="/site/contact"                  element={<Contact />} />
          <Route path="/site/blog"                     element={<Blog />} />
          <Route path="/site/blog/author/:slug"        element={<BlogAuthor />} />
          <Route path="/site/blog/:slug"               element={<BlogArticle />} />
          <Route path="/site/collections"              element={<Collections />} />
          <Route path="/site/collections/:slug"        element={<CollectionDetail />} />
          <Route path="/site/shop"                     element={<Shop />} />
          <Route path="/site/shop/:slug"               element={<ProductDetail />} />
          <Route path="/site/handmade"                 element={<Handmade />} />
          <Route path="/site/handmade/:slug"           element={<ProductDetail />} />
          <Route path="/site/privacy"                  element={<Privacy />} />
          <Route path="/site/terms"                    element={<Terms />} />
          <Route path="/site/shipping-returns"         element={<ShippingReturns />} />
          <Route path="/site/cart"                     element={<Cart />} />
          <Route path="/site/checkout"                 element={<Checkout />} />
          <Route path="/site/checkout/confirmation"    element={<OrderConfirmation />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
