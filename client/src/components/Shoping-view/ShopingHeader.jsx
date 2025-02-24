import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/Config/Index'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { logoutUser } from '@/Store/auth-slice/Index'
import User_Cart_Wrapper from './User_Cart_Wrapper'
import { useEffect, useState } from 'react'
import { fetchCartItems } from '@/Store/shop/Crat_slice'
import { Label } from '../ui/label'
import { DialogTitle } from '../ui/dialog'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";



function MenuItems(){

const navigate = useNavigate()
const location = useLocation();
const [searchParams, setSearchParams] = useSearchParams();
function handleNavigate(getCurrentMenuItem){
    sessionStorage.removeItem('filters')
    const currentFilter = getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== "products" && getCurrentMenuItem.id !== "search" ? 
    {
      category : [getCurrentMenuItem.id]
    } : null

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    // navigate(getCurrentMenuItem.path)
    location.pathname.includes("listing") && currentFilter !== null
    ? setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      )
    : navigate(getCurrentMenuItem.path);
}

  return <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'>
    {
      shoppingViewHeaderMenuItems.map((menuItem)=> <Label onClick={()=>handleNavigate(menuItem)} className='text-sm font-medium' key={menuItem.id} to={menuItem.path}>{menuItem.label}</Label>)
    }
  </nav>
}

function HeaderRightContent() {

  const {user} = useSelector((state)=> state.auth)
  const {cartItems}= useSelector((state)=>state.shopCart)
  const [openCartSheet,setOpenCartSheet] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  function handleLogout(){
      dispatch(logoutUser())
  }

  useEffect(()=>{
      dispatch(fetchCartItems(user?.id))
  },[dispatch])



    return <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}>
      <Button onClick={()=>setOpenCartSheet(true)} variant="outline"
          size="icon"
          className="relative">
            <ShoppingCart className='w-6 h-6 text-black' />
            <span className='absolute top-[-3px] right-[2px] font-bold text-sm'>{cartItems?.items?.length || 0}</span>
            <span className='sr-only'>User Cart</span>
      </Button>
      <SheetContent aria-describedby={undefined}>  
        <VisuallyHidden>
          <DialogTitle>Shopping Cart</DialogTitle>
        </VisuallyHidden>
        <User_Cart_Wrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
        </SheetContent>
      </Sheet>
     
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className='bg-black text-xl'>
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='right' className='w-56'>
            <DropdownMenuLabel>
              Logged in as {user?.userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>navigate('/shop/account')}>
                  <UserCog className='mr-1 h-4 w-4' />Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className='mr-1 h-4 w-4' />Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    </div>
}

const ShopingHeader = () => {
const {isAuthenticated, user} = useSelector((state)=> state.auth)

console.log(isAuthenticated, user, 'isAuthenticated, user'); 

  return <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
            <HousePlug className='h-6 w-6' />
            <span className='font-bold'>Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs" aria-describedby={undefined}>
             <MenuItems />
             <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div  className="hidden lg:block">
            <HeaderRightContent />
          </div> 
        </div>
    </header>
}

export default ShopingHeader







