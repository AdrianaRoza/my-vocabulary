import { ChevronDown, Home, Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "./ui/collapsible"
 
export function AppSidebar() {
  return (
    <Sidebar className="">

      <SidebarContent className="mt-10">

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            Aqui é conteudo
          </SidebarGroupContent>
        </SidebarGroup>

        
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Categorias
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-270" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
            
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuAction>
                  <Home /> <span className="sr-only">Add Project</span>
                </SidebarMenuAction>
              </SidebarMenuItem>


              <SidebarMenu>
 
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <a href="/category/body">
                        <span>Body</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <a href="/category/food">
                        <span>Food</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>

              </SidebarMenu>


            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
