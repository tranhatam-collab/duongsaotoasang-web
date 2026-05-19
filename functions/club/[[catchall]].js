export const onRequest = async ({ request, env, params }) => {
  const url = new URL(request.url);
  let path = url.pathname.replace(/^\/club\//, "").replace(/\/$/, "");

  if (!path) {
    return new Response(null, { status: 302, headers: { location: "/club" } });
  }

  const parts = path.split("/");
  const slug = parts[0];
  const sub = parts[1] || null;

  let file;
  const qs = new URLSearchParams();
  qs.set("slug", slug);

  if (!sub) {
    file = "/club/creator.html";
  } else if (sub === "public") {
    file = "/club/creator-public.html";
  } else if (sub === "talkshows") {
    file = "/club/creator-talkshows.html";
  } else if (sub === "membership") {
    file = "/club/creator-membership.html";
  } else if (sub === "rewards") {
    file = "/club/creator-rewards.html";
  } else {
    return new Response("Not Found", { status: 404 });
  }

  const redirectUrl = `${file}?${qs.toString()}`;
  return new Response(null, {
    status: 302,
    headers: { location: redirectUrl },
  });
};
