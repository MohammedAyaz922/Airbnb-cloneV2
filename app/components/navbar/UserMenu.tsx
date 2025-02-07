"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

const UserMenu: FC<UserMenuProps> = ({ currentUser }) => {
    console.log("logging current user:", currentUser);

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const closeMenu = () => setIsOpen(false); 

    const onRent = useCallback(() => {
        if (!currentUser) {
            closeMenu();
            return loginModal.onOpen();
        }
        rentModal.onOpen();
        closeMenu(); 
    }, [currentUser, loginModal, rentModal]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onRent}
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                >
                    Airbnb you home
                </div>
                <div
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image} />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {!currentUser ? (
                            <>
                                <MenuItem onClick={() => { loginModal.onOpen(); closeMenu(); }} label="Login" />
                                <MenuItem onClick={() => { registerModal.onOpen(); closeMenu(); }} label="Sign up" />
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={() => { router.push("/trips"); closeMenu(); }} label="My trips" />
                                <MenuItem onClick={() => { router.push("/favorites"); closeMenu(); }} label="My favorites" />
                                <MenuItem onClick={() => { router.push("/reservations"); closeMenu(); }} label="My reservations" />
                                <MenuItem onClick={() => { router.push("/properties"); closeMenu(); }} label="My properties" />
                                <MenuItem onClick={onRent} label="Airbnb my home" />
                                <hr />
                                <MenuItem onClick={() => { signOut(); closeMenu(); }} label="Logout" />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
