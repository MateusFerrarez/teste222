"use client";

import { useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SEARCH_MAX_LENGTH } from "@/app/lib/search";
import { SearchIcon } from "@/app/ui/icons";
import { Loading } from "@/app/ui/loading";

type Filter = {
  /** URL search param the select writes to. */
  param: string;
  /** Accessible name of the select. */
  label: string;
  /** Label of the empty (no filter) option. */
  allLabel: string;
  options: readonly { value: string; label: string }[];
};

type Props = {
  placeholder: string;
  width: number;
  /** When given, renders a filter select next to the search box. */
  filter?: Filter;
};

export function SearchControls({ placeholder, width, filter }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [pending, startTransition] = useTransition();

  useEffect(() => () => clearTimeout(timer.current), []);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    // New search or filter → back to the first page.
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <>
      <div className="search-box" style={{ width }}>
        <SearchIcon className="search-icon" />
        <input
          type="text"
          className="input"
          placeholder={placeholder}
          aria-label={placeholder}
          maxLength={SEARCH_MAX_LENGTH}
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            clearTimeout(timer.current);
            timer.current = setTimeout(() => update("q", value.trim()), 300);
          }}
        />
      </div>
      {filter && (
        <select
          className="select"
          style={{ width: 180 }}
          aria-label={filter.label}
          defaultValue={searchParams.get(filter.param) ?? ""}
          onChange={(e) => update(filter.param, e.target.value)}
        >
          <option value="">{filter.allLabel}</option>
          {filter.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {pending && <Loading inline label="Buscando…" />}
    </>
  );
}
