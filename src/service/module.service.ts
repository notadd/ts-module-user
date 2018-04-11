import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Module } from "../model/module.entity";

@Component()
export class ModuleService {

    constructor(
        @InjectRepository(Module) private readonly moduleRepository: Repository<Module>
    ) {
    }

    async getAll(): Promise<Array<Module>> {
        return this.moduleRepository.find({ relations: [ "roles", "funcs", "permissions" ] });
    }

}
