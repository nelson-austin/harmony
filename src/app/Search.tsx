"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex items-center gap-1">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <input
        className="rounded-lg border w-[310px] md:w-[370px] py-[9px] pl-10 text-lg outline-2 placeholder:text-gray-500 text-gray-900"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="h-[49px] w-[49px] rounded-lg border border-white-900 -translate-y-0 text-white-900 peer-focus:text-gray-900" />
    </div>
  );
}