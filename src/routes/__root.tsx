import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import FolderSidebar from "@/components/folderSidebar";
import WebcomponentsImporter from "@/components/webcomponent-importer";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<React.Fragment>
			<SidebarProvider>
				<FolderSidebar />
				<div>
					<SidebarTrigger />
					<WebcomponentsImporter />
				</div>
				<Outlet />
			</SidebarProvider>
			<Toaster />
			<TanStackRouterDevtools />
		</React.Fragment>
	);
}
