<?php

use GraphQL\GraphQL;
use GraphQL\Type\Schema;

// Include the necessary files
require('type.php');
require('query.php');
require('mutation.php');


$schema = new Schema([
    'query' => $rootquery,
    'mutation' => $rootmutation
]);

try {

    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (isset($input['query'])) {
        $query = $input['query'];
    } else {
        throw new Exception('Query not provided');
    }

    if (isset($input['variables'])) {
        $variableValues = $input['variables'];
    } else {
        $variableValues = null;
    }

    error_log('GraphQL Query: ' . $query);
    error_log('GraphQL Variables: ' . json_encode($variableValues));

    $result = GraphQL::executeQuery($schema, $query, null, null, $variableValues);
    $output = $result->toArray();
} catch (\Exception $e) {
    $output = [
        'errors' => [
            ['message' => $e->getMessage()]
        ]
    ];
}

header('Content-Type: application/json');
echo json_encode($output);
