import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function AnouncementBar() {
    
    return (
        <div className="bg-[#F6DB8D] w-full p-[10px] text-xs flex flex-col sm:flex-row items-center justify-center gap-1">
            <div>Besoin d'assistance ? Appelez-nous au : <span className="font-medium">24 331 900</span></div>ou rendez-nous visite dans l'un de 
            <Link href="/showrooms" className="font-medium flex items-center gap-0.5 text-nowrap">
                Nos Showrooms
                <ChevronRightIcon className="h-[15px]"/>
            </Link>
        </div>
    );

}