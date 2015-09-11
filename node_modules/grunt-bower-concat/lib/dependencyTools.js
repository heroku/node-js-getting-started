/**
 * Builds up a dependency graph for using a simple object structure containing the modules as keys and using arrays
 * as dependecy descriptors.
 */

function buildDependencyGraph(module, dependencies, graph) {
	if (module && !graph[module]) {
		graph[module] = [];
	}

	var dependencyNames = Object.keys(dependencies);
	dependencyNames.forEach(function(dependencyName) {
		var dependency = dependencies[dependencyName];

		if (module && graph[module].indexOf(dependencyName) === -1) {
			graph[module].push(dependencyName);
		}

		// Traverse down to this dependency dependencies:
		// Dependency-ception.
		if (dependency.dependencies) {
			buildDependencyGraph(dependencyName, dependency.dependencies, graph);
		}
	});
}

/**
 * Resolves a graph of dependencies into a flat, ordered array.
 *
 * The arrays ordering ensures, that a dependecy of another module comes before the module itself.
 *
 * This algorithem is adapted from the pseudo code example available here:
 * http://www.electricmonk.nl/log/2008/08/07/dependency-resolving-algorithm/
 */
function resolveDependencyGraph(module, resolved, unresolved, dependencies) {
	var moduleDependencies;
	if (module) {
		moduleDependencies = dependencies[module];
		if (!moduleDependencies) {
			throw new Error('Component ' + module + ' not installed. Try bower install --save ' + module);
		}
		unresolved.push(module);
	}
	else {
		moduleDependencies = Object.keys(dependencies);
	}

	moduleDependencies.forEach(function(moduleDependency) {
		if (resolved.indexOf(moduleDependency) === -1) {
			if (unresolved.indexOf(moduleDependency) !== -1) {
				throw new Error('Circular reference detected for ' + module + ' - ' + moduleDependency);
			}

			resolveDependencyGraph(moduleDependency, resolved, unresolved, dependencies);
		}
	});

	if (module) {
		resolved.push(module);
		unresolved = unresolved.splice(unresolved.indexOf(module), 1);
	}
}


module.exports = {
	buildDependencyGraph: buildDependencyGraph,
	resolveDependencyGraph: resolveDependencyGraph
};
