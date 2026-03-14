import { CategorySection, AlgoLink } from "@/components/custom-ui/contents";

const ALGO_MAP = [
  {
    name: "Array",
    pages: [
      { name: "Bubble Sort", link: "/bubble-sort" }
    ]
  }
];

export default function Page() {

  return (
    <div>
      {ALGO_MAP.map((algo, idx) => (
        <CategorySection key={idx} name={algo.name}>
          {algo.pages.map((page) => (
            <AlgoLink key={page.name} name={page.name} link={page.link} />
          ))}
        </CategorySection>
      ))}
    </div>
  );
} 