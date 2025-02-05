export default defineCachedEventHandler(
	async () => {
		const runtimeConfig = useRuntimeConfig();

		let githubContributors = {
			total: 0,
			data: [] as { id: number; name: string; avatar: string }[]
		};

		let buyMeACoffeeSupporters = {
			total: 0,
			data: [] as { id: number; name: string; type: string; avatar: string }[]
		};

		if (runtimeConfig.public.github_repo) {
			const githubContributorsRes = await fetch(
				`https://api.github.com/repos/${runtimeConfig.public.github_repo}/contributors`
			)
				.then(res => res.json())
				.catch(() => null);

			if (Array.isArray(githubContributorsRes)) {
				githubContributors.total = githubContributorsRes.length;

				githubContributors.data = githubContributorsRes.map((contributor: any) => ({
					id: contributor.id,
					name: contributor.login,
					avatar: contributor.avatar_url
				}));
			}
		}

		if (runtimeConfig.public.buy_me_a_coffee_id) {
			const buyMeACoffeeSupportersPrivateRes = await fetch(
				'https://developers.buymeacoffee.com/api/v1/supporters',
				{
					headers: {
						Authorization: `Bearer ${runtimeConfig.buy_me_a_coffee_token}`
					}
				}
			)
				.then(res => res.json())
				.catch(() => null);

			if (buyMeACoffeeSupportersPrivateRes?.total) {
				buyMeACoffeeSupporters.total = buyMeACoffeeSupportersPrivateRes.total;
			}

			const buyMeACoffeeSupportersPublicRes = await fetch(
				`https://app.buymeacoffee.com/api/v1/timeline/project/7352489/?page=1&per_page=20`
			)
				.then(res => res.json())
				.catch(() => null);

			if (Array.isArray(buyMeACoffeeSupportersPublicRes?.data)) {
				buyMeACoffeeSupporters.data = buyMeACoffeeSupportersPublicRes.data.map((support: any) => ({
					id: support.id,
					name: support.supporter?.name || 'Anonymous',
					type: support.supporter?.name_type || '',
					avatar: support.supporter?.dp || ''
				}));
			}
		}

		return {
			github_contributors: githubContributors,
			buy_me_a_coffee_supporters: buyMeACoffeeSupporters
		};
	},
	{ maxAge: 60 * 10 }
);
