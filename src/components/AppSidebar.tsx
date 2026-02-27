import { ChevronDown, Home, Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { 
  DropdownMenuTrigger, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "./ui/dropdown-menu"

import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "./ui/collapsible"
 
export function AppSidebar() {
  return (
    <Sidebar>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>

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
                Help
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
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton>{index}</SidebarMenuButton>
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>


            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
